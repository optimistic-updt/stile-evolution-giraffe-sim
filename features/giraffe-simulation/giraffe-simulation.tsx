"use client";

// TODO
// test the giraffe refresh on each generation

import { useState, useEffect, useRef, FC } from "react";
import { Button } from "@/lib/ui/button";
import { Slider } from "@/lib/ui/slider";
import { RefreshCcw, Play, Pause } from "lucide-react";
import { Giraffe, createGiraffe } from "./giraffe";
import { Tree, createTree } from "./tree";

/**
 * Setup / Params
 */
const MIN_TREE_HEIGHT = 100;
const MAX_TREE_HEIGHT = 250;

export const TREE_COUNT = 3;

const GIRAFFE_COUNT = 10;
const GIRAFFE_HEAD_HEIGHT = 20;

export let GiraffeSimulation: FC = () => {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let [isRunning, setIsRunning] = useState(false);
  let [generation, setGeneration] = useState(1);
  let [treeHeight, setTreeHeight] = useState(180);
  let [giraffes, setGiraffes] = useState<Giraffe[]>([]);
  let [trees, setTrees] = useState<Tree[]>([]);
  let [stats, setStats] = useState({
    total: 0,
    surviving: 0,
    avgNeckHeight: 0,
  });

  let timeOutId: NodeJS.Timeout;

  let animationRef = useRef<number>(0);
  let frameCountRef = useRef(0);

  // resets to a fresh generation of giraffes and trees
  let resetSimulation = () => {
    let newGiraffes: Giraffe[] = [];
    let newTrees: Tree[] = [];

    // Create trees
    for (let i = 0; i < TREE_COUNT; i++) {
      let tree = createTree(i, treeHeight);
      newTrees.push(tree);
    }

    // Create giraffes
    for (let i = 0; i < GIRAFFE_COUNT; i++) {
      let giraffe = createGiraffe(i);
      newGiraffes.push(giraffe);
    }

    setGiraffes(newGiraffes);
    setTrees(newTrees);
    setGeneration(1);
    setIsRunning(false);
    calculateStats(newGiraffes);

    // Draw initial state
    let canvas = canvasRef.current;
    if (canvas) {
      let ctx = canvas.getContext("2d");
      if (ctx) {
        drawSimulation(ctx, newGiraffes, newTrees);
      }
    }
  };

  // Calculate statistics
  let calculateStats = (currentGiraffes: Giraffe[]) => {
    let alive = currentGiraffes.filter((g) => g.alive);
    let avgHeight =
      alive.length > 0
        ? alive.reduce((sum, g) => sum + g.neckHeight, 0) / alive.length
        : 0;

    setStats({
      total: currentGiraffes.length,
      surviving: alive.length,
      avgNeckHeight: Math.round(avgHeight),
    });
  };

  // Update simulation state
  let updateSimulation = () => {
    setGiraffes((prevGiraffes) => {
      let updatedGiraffes = [...prevGiraffes];

      // Check if giraffe can reach leaves
      let testReachability = (giraffe: Giraffe) => {
        if (!giraffe.alive) return;

        let canReach =
          giraffe.neckHeight + GIRAFFE_HEAD_HEIGHT >= treeHeight - 100;

        if (canReach) {
          giraffe.eating = true;
        } else {
          giraffe.alive = false;
          giraffe.eating = false;
          // Start fading out
          giraffe.opacity = 0.8;
        }

        return giraffe;
      };

      const fadeOutDeadOnes = (giraffe: Giraffe) => {
        if (!giraffe.alive && giraffe.opacity > 0) {
          giraffe.opacity -= 0.01;
        }
      };

      updatedGiraffes.forEach((giraffe) => {
        // Check which giraffes can reach leaves
        testReachability(giraffe);

        fadeOutDeadOnes(giraffe);

        return giraffe;
      });

      // Check if all giraffes have been evaluated
      let allEvaluated = updatedGiraffes.every(
        (g) => g.eating || !g.alive || g.opacity <= 0,
      );

      if (allEvaluated) {
        // Create new generation with traits from survivors
        timeOutId = setTimeout(() => {
          createNewGeneration();
        }, 1000);
      }
      calculateStats(updatedGiraffes);

      return updatedGiraffes;
    });
  };

  let createNewGeneration = () => {
    setGiraffes((prevGiraffes) => {
      let survivors = prevGiraffes.filter((g) => g.alive);

      // If no survivors, reset simulation
      if (survivors.length === 0) {
        resetSimulation();
        return prevGiraffes;
      }

      let newGiraffeGeneration: Giraffe[] = survivors.map((giraffe) => ({
        ...giraffe,
        eating: false,
      }));

      // Create new generation based on survivors' traits
      // let newGiraffeGeneration: Giraffe[] = [];
      // Each survivor produces one offspring
      // survivors.forEach((parent, index) => {
      //   // Create offspring with slight mutation
      //   let mutation = Math.random() * 20 - 10 // -10 to +10
      //   let neckHeight = Math.max(60, Math.min(200, parent.neckHeight + mutation))
      // })

      calculateStats(newGiraffeGeneration);
      return newGiraffeGeneration;
    });

    setGeneration((prev) => prev + 1);

    // grow the trees
    setTreeHeight((prev) => {
      let newHeight = Math.min(MAX_TREE_HEIGHT, prev + 10);

      let grownTrees = trees.map((tree) => {
        tree.height = newHeight;
        tree.leafHeight = newHeight - 20;

        return tree;
      });

      setTrees(grownTrees);

      return newHeight;
    });
  };

  // Draw simulation on canvas
  let drawSimulation = (
    ctx: CanvasRenderingContext2D,
    currentGiraffes: Giraffe[],
    currentTrees: Tree[],
  ) => {
    if (!ctx || !ctx.canvas) return;

    let horizonYPos = 350;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw ground
    ctx.fillStyle = "#8BC34A";
    ctx.fillRect(0, horizonYPos, ctx.canvas.width, 50);

    // Draw trees
    currentTrees.forEach((tree) => {
      // Draw trunk
      ctx.fillStyle = "#795548";
      ctx.fillRect(tree.x - 15, horizonYPos - tree.height, 30, tree.height);

      // Draw leaves
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.arc(tree.x, horizonYPos - tree.height, 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw edible leaves
      ctx.fillStyle = "#00E676";
      ctx.beginPath();
      ctx.arc(tree.x - 30, horizonYPos - tree.leafHeight, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tree.x + 30, horizonYPos - tree.leafHeight, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw giraffes
    const GIRAFFE_BODY_HEIGHT = 60;
    currentGiraffes.forEach((giraffe) => {
      if (giraffe.opacity <= 0) return;

      ctx.globalAlpha = giraffe.opacity;

      // Draw body
      ctx.fillStyle = "#FFC107";
      ctx.fillRect(
        giraffe.x - 20,
        horizonYPos - GIRAFFE_BODY_HEIGHT,
        40,
        GIRAFFE_BODY_HEIGHT,
      );

      // Draw spots on body
      ctx.fillStyle = "#FF9800";
      giraffe.bodySpots.forEach((spot) => {
        ctx.beginPath();
        ctx.arc(
          giraffe.x + spot.x,
          horizonYPos + spot.y,
          spot.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      // Draw neck
      ctx.fillStyle = "#FFC107";
      ctx.fillRect(
        giraffe.x - 10,
        horizonYPos - GIRAFFE_BODY_HEIGHT - giraffe.neckHeight,
        20,
        giraffe.neckHeight,
      );

      // Draw spots on neck
      ctx.fillStyle = "#FF9800";
      giraffe.neckSpots.forEach((spot) => {
        ctx.beginPath();
        ctx.arc(
          giraffe.x + spot.x,
          horizonYPos + spot.y,
          spot.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      // Draw head
      ctx.fillStyle = "#FFC107";
      ctx.fillRect(
        giraffe.x - 15,
        horizonYPos -
          GIRAFFE_BODY_HEIGHT -
          giraffe.neckHeight -
          GIRAFFE_HEAD_HEIGHT,
        30,
        20,
      );

      // Draw eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(
        giraffe.x - 8,
        horizonYPos -
          GIRAFFE_BODY_HEIGHT -
          giraffe.neckHeight -
          GIRAFFE_HEAD_HEIGHT / 2,
        2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        giraffe.x + 8,
        horizonYPos -
          GIRAFFE_BODY_HEIGHT -
          giraffe.neckHeight -
          GIRAFFE_HEAD_HEIGHT / 2,
        2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Draw eating animation if applicable
      if (giraffe.eating) {
        ctx.fillStyle = "#F635FF";
        ctx.beginPath();
        ctx.arc(
          giraffe.x,
          horizonYPos -
            GIRAFFE_BODY_HEIGHT -
            giraffe.neckHeight -
            (GIRAFFE_HEAD_HEIGHT + 5),
          5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      // reset opacity
      ctx.globalAlpha = 1;
    });
  };

  // Start/stop simulation
  let toggleSimulation = () => {
    setIsRunning((prev) => !prev);
  };

  // Initialize simulation - TODO
  useEffect(() => {
    resetSimulation();

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(timeOutId);
    };
  }, []);

  // Initialize canvas after component mounts
  useEffect(
    function initCanvas() {
      let canvas = canvasRef.current;
      if (canvas) {
        // Set canvas dimensions explicitly
        canvas.width = 800;
        canvas.height = 400;

        let ctx = canvas.getContext("2d");

        if (ctx && trees.length > 0 && giraffes.length > 0) {
          drawSimulation(ctx, giraffes, trees);
        }
      }
    },
    [canvasRef.current],
  );

  // Animation loop
  useEffect(
    function runAnimation() {
      if (!isRunning) return;

      let canvas = canvasRef.current;
      if (!canvas) return;

      let ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animate = () => {
        try {
          frameCountRef.current += 1;

          // Update simulation every 60 frames (approximately 1 second)
          if (frameCountRef.current % 60 === 0) {
            updateSimulation();
          }

          // Draw current state
          drawSimulation(ctx, giraffes, trees);

          // Continue animation
          animationRef.current = requestAnimationFrame(animate);
        } catch (error) {
          console.error("Animation error:", error);
          cancelAnimationFrame(animationRef.current);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationRef.current);
      };
    },
    [isRunning, giraffes, trees],
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold">Generation: {generation}</h3>
            <p>
              Surviving: {stats.surviving}/{stats.total} giraffes
            </p>
            <p>Average neck height: {stats.avgNeckHeight}cm</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleSimulation}
              className="bg-stile-green hover:bg-stile-green-dark text-white"
            >
              {isRunning ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="border-stile-green text-stile-green hover:bg-[#E8F5E9]"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Tree Height: {treeHeight}cm
          </label>
          <Slider
            value={[treeHeight]}
            min={MIN_TREE_HEIGHT}
            max={MAX_TREE_HEIGHT}
            step={10}
            onValueChange={(value) => setTreeHeight(value[0])}
            className="w-full"
            disabled={isRunning}
          />
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-[400px] border border-gray-200 rounded-lg bg-[#E8F5E9]"
        />

        <div className="mt-4 text-sm text-gray-600">
          <p>
            This simulation demonstrates natural selection. Giraffes with necks
            too short to reach the leaves cannot feed and will disappear. Over
            generations, the average neck height increases as taller giraffes
            are more likely to survive and reproduce.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiraffeSimulation;
