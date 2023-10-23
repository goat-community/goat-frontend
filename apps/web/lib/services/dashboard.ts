import mapData from "@/lib/utils/project_layers_demo_update";
import contentData from "@/lib/utils/template_content";

export const contentDataFetcher = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(contentData);
    }, 1000); // Simulate a 1-second delay
  });
};

// Function to simulate fetching data asynchronously
export const mapDataFetcher = () => {
  return new Promise((resolve) => {
    // Simulate an asynchronous delay (e.g., 1 second)
    setTimeout(() => {
      resolve(mapData);
    }, 1000); // Simulate a 1-second delay
  });
};
