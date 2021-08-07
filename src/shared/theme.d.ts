import "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    backgroundSecondary: Palette["background"];
  }
  interface PaletteOptions {
    backgroundSecondary: PaletteOptions["background"];
  }
}
