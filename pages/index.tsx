import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

// Support a subset of companies for V0.
const companyNames = [
  "Bank of America",
  "Barclays",
  "Citi",
  "Evercore",
  "JP Morgan",
  "Lazard",
  "Mckinsey",
  "Morgan Stanley",
  "UBS",
];

// Canvas constants to make the graph drawing easier.
const nodePositions = [
  { x: 80, y: 80, fromX: 100, fromY: 100, toX: 220, toY: 220 },
  { x: 250, y: 80, fromX: 250, fromY: 110, toX: 250, toY: 210 },
  { x: 420, y: 80, fromX: 400, fromY: 100, toX: 280, toY: 220 },
  { x: 80, y: 250, fromX: 110, fromY: 250, toX: 210, toY: 250 },
  { x: 420, y: 250, fromX: 390, fromY: 250, toX: 290, toY: 250 },
  { x: 80, y: 420, fromX: 100, fromY: 400, toX: 220, toY: 280 },
  { x: 250, y: 420, fromX: 250, fromY: 390, toX: 250, toY: 290 },
  { x: 420, y: 420, fromX: 400, fromY: 400, toX: 280, toY: 280 },
];

const Home = () => {
  const [company, setCompany] = useState(companyNames[0]);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();

  // Initialize the canvas on page load.
  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas && (canvas as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      setCanvasCtx(ctx);
    }
  }, []);

  // Call the people api with the chosen current company.
  const {
    data: peopleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["people", company],
    queryFn: async () => {
      const response = await fetch(
        `https://dev-dot-recruit-u-f79a8.uc.r.appspot.com/api/lateral-recruiting?count=100&current_company=${encodeURIComponent(
          company
        )}`
      );
      return await response.json();
    },
  });

  // Store information on how many people used to work at another supported company.
  const prevCompaniesMap: { [key: string]: number } = useMemo(() => {
    const newMap: { [key: string]: number } = {};

    if (!peopleData?.results) {
      return {};
    }

    companyNames.forEach((comp) => {
      const personCount = peopleData.results.filter(
        (person: { document: { previous_companies: string } }) =>
          person.document.previous_companies.includes(comp)
      ).length;
      newMap[comp] = personCount;
    });

    return newMap;
  }, [peopleData]);

  // Function to draw graph nodes, labels, and edges on the canvas.
  const drawGraph = () => {
    if (!canvasCtx) {
      console.error("Canvas not initialized");
      return;
    }

    // Reset canvas to prepare for drawing.
    canvasCtx.clearRect(0, 0, 500, 500);
    canvasCtx.font = "16px Arial";
    const otherCompanies = companyNames.filter((comp) => comp !== company);

    // Draw current company in the middle.
    canvasCtx.beginPath();
    canvasCtx.arc(250, 250, 30, 0, 2 * Math.PI);
    canvasCtx.stroke();
    canvasCtx.fillText(company, 220, 300);

    // Draw other companies.
    for (let i = 0; i < 8; i++) {
      const nodePosition = nodePositions[i];
      const comp = otherCompanies[i];

      canvasCtx.beginPath();
      canvasCtx.arc(nodePosition.x, nodePosition.y, 20, 0, 2 * Math.PI);
      canvasCtx.stroke();
      canvasCtx.fillText(comp, nodePosition.x - 20, nodePosition.y + 40);

      if (prevCompaniesMap[comp]) {
        canvasCtx.moveTo(nodePosition.fromX, nodePosition.fromY);
        canvasCtx.lineTo(nodePosition.toX, nodePosition.toY);
        canvasCtx.stroke();
        canvasCtx.fillText(
          prevCompaniesMap[comp].toString(),
          nodePosition.x - 4,
          nodePosition.y + 4
        );
      }
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col w-[570px]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Company Movement Graph V0</h1>
        {isLoading && <p className="text-gray-700 text-sm">Loading...</p>}
        {error && <p className="text-red-700 text-sm">Error, please refresh</p>}
      </div>
      <div className="flex justify-between py-2 items-center">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-sm text-gray-700">
            Choose current company
          </label>
          <select
            onChange={(event) => setCompany(event.target.value)}
            className="px-2 py-1"
          >
            {companyNames.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={drawGraph}
          className="cursor-pointer border border-blue-800 text-blue-800 rounded-sm px-2 py-1 font-semibold"
        >
          Draw!
        </button>
      </div>
      <div>
        <canvas
          id="myCanvas"
          className="border"
          width="500"
          height="500"
        ></canvas>
      </div>
      <div className="flex justify-end">
        <p className="text-sm py-1 text-gray-700">
          Note: currently 100 data points max
        </p>
      </div>
    </div>
  );
};

export default Home;
