import { useCallback, useEffect, useMemo } from "react";
import { CommandRegistry } from "../Command/registery";
import { Command } from "../types/command";
import { useSpotlightify } from "./useSpotlightify";
// import PlayCommand from "../Command/Commands/play";
// import PauseCommand from "../Command/Commands/pause";
// import Queue from "../Command/Commands/queue";
// import NextCommand from "../Command/Commands/next";
// import PreviousCommand from "../Command/Commands/previous";
// import ResumeCommand from "../Command/Commands/resume";
// import DeviceCommand from "../Command/Commands/device";
// import VolumeCommand from "../Command/Commands/volume";
// import AlbumCommand from "../Command/Commands/album";
// import LikeCommand from "../Command/Commands/like";
// import GotoCommand from "../Command/Commands/goto";
// import PlaylistCommand from "../Command/Commands/playlist";
// import PodcastCommand from "../Command/Commands/podcast";
// import CurrentlyPlayingCommand from "../Command/Commands/currentlyplaying";
// import ShuffleCommand from "../Command/Commands/shuffle";
// import RepeatCommand from "../Command/Commands/repeat";
// import ExitCommand from "../Command/Commands/exit";
// import ArtistCommand from "../Command/Commands/artist";
// import AuthenticateCommand from "../Command/Commands/authenticate/authenticate";
// import { WindowHide } from "../../wailsjs/runtime/runtime";
// import PlayLikedSongs from "../Command/Commands/liked";

export interface CommandOptions {
  parameters?: Record<string, string>;
  keepPromptOpen?: boolean;
}

export interface CommandHistoryItem {
  command: Command;
  options?: CommandOptions;
}

function useCommand() {
  const { state, actions } = useSpotlightify();
  const { commandHistory, activeCommand } = state;
  const commandRegistry = useMemo(() => new CommandRegistry(), []);
  const activeCommandOptions = state.activeCommand?.options;

  // Register all commands here
  useEffect(() => {
    return; // TODO: Implement this
    // if (commandRegistry.getAllCommands().length === 0) {
    //   // Ensures that commands are only registered once in STRICT Mode
    //   commandRegistry.register(new PlayCommand());
    //   commandRegistry.register(new Queue());
    //   commandRegistry.register(new PlaylistCommand());
    //   commandRegistry.register(new AlbumCommand());
    //   commandRegistry.register(new ArtistCommand());
    //   commandRegistry.register(new PodcastCommand());
    //   commandRegistry.register(new PlayLikedSongs());

    //   // Playback control commands
    //   commandRegistry.register(new PauseCommand());
    //   commandRegistry.register(new ResumeCommand());
    //   commandRegistry.register(new NextCommand());
    //   commandRegistry.register(new PreviousCommand());
    //   commandRegistry.register(new DeviceCommand());
    //   commandRegistry.register(new VolumeCommand());
    //   commandRegistry.register(new GotoCommand());
    //   commandRegistry.register(new ShuffleCommand());
    //   commandRegistry.register(new RepeatCommand());

    //   // Misc commands
    //   commandRegistry.register(new LikeCommand());
    //   commandRegistry.register(new CurrentlyPlayingCommand());

    //   commandRegistry.register(new AuthenticateCommand());

    //   commandRegistry.register(new ExitCommand());
    // }
  }, [commandRegistry]);

  useEffect(() => {
    if (!activeCommand) {
      actions.setPlaceholderText("Spotlightify Search");
    }
  }, [actions, activeCommand]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!activeCommand) {
          // WindowHide();
        }
        if (!activeCommandOptions?.lockCommandStack) {
          actions.popCommand();
        }
      }
      if (event.key === "Backspace") {
        if (
          state.promptInput.length === 0 &&
          activeCommand &&
          !activeCommandOptions?.lockCommandStack
        ) {
          actions.popCommand();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener on cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    actions,
    activeCommand,
    activeCommandOptions?.lockCommandStack,
    state.promptInput.length,
  ]);

  // For displaying on the prompt
  const commandTitles = useMemo(() => {
    const titles = commandHistory.reduce(
      (arr: string[], item, currentIndex) => {
        if (currentIndex === commandHistory.length - 1) {
          return arr;
        }
        arr.push(item.command.shorthandTitle);
        return arr;
      },
      []
    );

    if (activeCommand) {
      titles.push(activeCommand?.command.title);
    }
    return titles;
  }, [activeCommand, commandHistory]);

  const commandSearch = useCallback((input: string) => {
    return commandRegistry.searchByKeyword(input);
  }, []);

  return {
    commandSearch,
    commandTitles,
  };
}

export default useCommand;
