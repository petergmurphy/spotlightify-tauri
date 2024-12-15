// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::GlobalShortcutManager;

fn main() {
    spotlightify_lib::run()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let handle = app.handle();
            app.global_shortcut_manager()
                .register("CommandOrControl+Alt+Space", move || {
                    let window = handle.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                })?;

            Ok(())
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::Destroyed = event.event() {
                // Clean up shortcuts when the window is closed
                event
                    .window()
                    .app_handle()
                    .global_shortcut_manager()
                    .unregister_all()
                    .unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
