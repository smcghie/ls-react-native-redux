import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';

interface AlbumState {
    openAlbum: string | null;
    activePhoto: {
      momentId: string | null;
    };
  }

const initialState: AlbumState = {
    openAlbum: null,
    activePhoto: { momentId: null },
};

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    setOpenAlbum(state, action: PayloadAction<string | null>) {
      state.openAlbum = action.payload;
    },
    setActivePhoto(state, action) {
      state.activePhoto = action.payload;
      console.log("ACTIVE PHOTO: ", state.activePhoto)
    },
    toggleExpandedValue(state, action) {
    },
    handleAlbumClick(state, action) {
    },
  },
});

export const { setOpenAlbum, setActivePhoto, toggleExpandedValue, handleAlbumClick } = albumSlice.actions;

export default albumSlice.reducer;
