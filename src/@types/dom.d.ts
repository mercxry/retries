declare global {
    interface WindowEventMap {
        'presetSelected': CustomEvent<PresetSelectedEvent>;
    }
}

export { };
