import { useState } from "react";

import Background from "./components/Background.tsx";
import Navbar from "./components/NavBar.tsx";
import Sidebar from "./components/SideBar.tsx";
import Panel from "./components/Panel.tsx";

import "/src/styles/App.css";
import Codeblock from "./components/Codeblock.tsx";

const sampleJavaCode = `class Solution {
    // Method to find max sum of subarray size k
    public int maxSubArraySum(int[] arr, int k) {
        // Track the maximum sum found
        int maxSum = 0;
        // Track the sum of the current sliding window
        int windowSum = 0;
        // Left pointer of the window
        int start = 0;

        // Iterate right pointer over array
        for (int end = 0; end < arr.length; end++) {
            // Add current element to window sum
            windowSum += arr[end];

            // Check if window size is at least k
            if (end >= k - 1) {
                // Update maximum sum if current window is larger
                maxSum = Math.max(maxSum, windowSum);
                // Subtract element going out of window from sum
                windowSum -= arr[start];
                // Move left pointer forward
                start++;
            }
        }

        // Return final maximum sum
        return maxSum;
    }
}`;

function App() {
  const [showSidebar, setSidebar] = useState(false);
  const [currentActiveLine, setCurrentActiveLine] = useState(1);

  const panelOneTabList = [
    {
      id: "inspector",
      title: "Structure Inspector",
      content: (
        <div className="p-2">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      ),
    },
  ];

  const panelTwoTabList = [
    {
      id: "code",
      title: "Code",
      content: (
        <Codeblock code={sampleJavaCode} highlightedLine={currentActiveLine} />
      ),
      // <div>Sexy Code here</div>,
    },
    {
      id: "testcase",
      title: "Test Case",
      content: <div>Test Cases</div>,
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />
      <Navbar onOpen={() => setSidebar(true)} />
      <Background />

      <div className="h-full grid grid-cols-3 p-6 gap-4 overflow-hidden">
        <Panel className="col-span-2" tabs={panelOneTabList} />
        <Panel className="grow" tabs={panelTwoTabList} />
      </div>
    </div>
  );
}

export default App;
