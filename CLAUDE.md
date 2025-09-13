# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Where in the World" is a React-based geography guessing game. Players guess locations on a map with zoom-based difficulty and scoring system.

## Development Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production (TypeScript compilation + Vite build)
- `yarn lint` - Run ESLint
- `yarn preview` - Preview production build

## Architecture

- **Map rendering**: Uses deck.gl + MapLibre GL via react-map-gl
- **Key dependencies**: React 18, TypeScript, Vite, deck.gl, MapLibre GL
