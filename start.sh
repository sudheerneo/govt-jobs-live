#!/bin/bash

# Ensure the menu runs in gnome-terminal
if [[ -z "$GNOME_TERMINAL_SERVICE" ]]; then
    gnome-terminal -- zsh -c "$0; exec zsh"
    exit
fi

yarn start --reset-cache
