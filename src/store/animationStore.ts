// src/store/animationStore.ts

import { create } from "zustand";

type animationData = {
  id: string;
  name: string;
  frames: Array<{
    frameNumber: number;
    imageUrl: string;
    duration: number;
  }>;
};

interface AnimationState {
  animationData: animationData | null;
  fetchAnimationData: () => Promise<void>;
}

const useAnimationStore = create<AnimationState>((set) => ({
  animationData: null,
  fetchAnimationData: async () => {
    try {
      const response = await fetch("/animation/plant.json");
      const data = await response.json();
      set({ animationData: data });
    } catch (error) {
      console.error("Failed to fetch animation data:", error);
    }
  },
}));

export default useAnimationStore;
