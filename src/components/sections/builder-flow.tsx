"use client";

import { memo, useEffect, useState } from "react";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getBezierPath,
  useEdgesState,
  useNodesState,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { motion } from "motion/react";
import {
  Bot,
  CalendarCheck,
  Check,
  Loader2,
  MessageCircle,
  Send,
  Split,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------- Tipos */

type RunStatus = "idle" | "running" | "success";

type FavxNodeData = {
  icon: LucideIcon;
  color: string;
  title: string;
  desc: string;
  core?: boolean;
  status: RunStatus;
};

type FavxFlowNode = Node<FavxNodeData, "favx">;

type PulseEdgeData = { status: RunStatus };
type PulseFlowEdge = Edge<PulseEdgeData, "pulse">;

/* ---------------------------------------------------------------- Fluxo */

// Largura fixa do nó: círculo centralizado em cima, rótulo embaixo
const NODE_W = 150;

const spec: { id: string; cx: number; cy: number; r: number; data: Omit<FavxNodeData, "status"> }[] = [
  { id: "t", cx: 80, cy: 210, r: 26, data: { icon: MessageCircle, color: "#2f6bff", title: "Mensagem recebida", desc: "Gatilho · WhatsApp" } },
  { id: "a", cx: 250, cy: 210, r: 36, data: { icon: Bot, color: "#ff3c00", title: "Agente de IA", desc: "Núcleo da IA", core: true } },
  { id: "l", cx: 420, cy: 210, r: 26, data: { icon: Split, color: "#ff4b08", title: "Classificar intenção", desc: "Lógica" } },
  { id: "s", cx: 590, cy: 90, r: 26, data: { icon: Send, color: "#2f6bff", title: "Enviar orçamento", desc: "Se pedir orçamento" } },
  { id: "g", cx: 590, cy: 330, r: 26, data: { icon: CalendarCheck, color: "#6fa3ff", title: "Agendar visita", desc: "Se quiser visitar" } },
];

const initialNodes: FavxFlowNode[] = spec.map((n) => ({
  id: n.id,
  type: "favx",
  position: { x: n.cx - NODE_W / 2, y: n.cy - n.r },
  data: { ...n.data, status: "idle" },
}));

const initialEdges: PulseFlowEdge[] = [
  ["t", "a"],
  ["a", "l"],
  ["l", "s"],
  ["l", "g"],
].map(([source, target]) => ({
  id: `${source}-${target}`,
  source,
  target,
  type: "pulse",
  data: { status: "idle" },
}));

// Roteiro da execução: [momento em ms, nós que mudam, arestas que mudam]
const SCRIPT: [number, Record<string, RunStatus>, Record<string, RunStatus>][] = [
  [700, { t: "running" }, {}],
  [1300, { t: "success" }, { "t-a": "running" }],
  [1900, { a: "running" }, { "t-a": "success" }],
  [3000, { a: "success" }, { "a-l": "running" }],
  [3600, { l: "running" }, { "a-l": "success" }],
  [4300, { l: "success" }, { "l-s": "running", "l-g": "running" }],
  [4900, { s: "running", g: "running" }, { "l-s": "success", "l-g": "success" }],
  [5600, { s: "success", g: "success" }, {}],
];

/* ------------------------------------------------------------------ Nó */

const FavxNode = memo(function FavxNode({ data }: NodeProps<FavxFlowNode>) {
  const { icon: Icon, color, title, desc, core, status } = data;
  const size = core ? 72 : 52;
  const running = status === "running";
  const active = status !== "idle";

  return (
    <div className="flex flex-col items-center" style={{ width: NODE_W }}>
      <Handle type="target" position={Position.Left} style={{ top: size / 2, left: NODE_W / 2 - size / 2 }} />

      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        {/* Brilho quando o nó executa */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full blur-xl"
          style={{ background: color }}
          animate={{ opacity: active ? 0.4 : core ? 0.2 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Órbita do Núcleo, como no FAVX Hub */}
        {core && (
          <motion.svg
            className="pointer-events-none absolute overflow-visible"
            width={size + 26}
            height={size + 26}
            viewBox="0 0 100 100"
            style={{ left: -13, top: -13 }}
            animate={{ rotate: 360 }}
            transition={{ duration: running ? 3 : 12, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={running ? "10 6" : "3 9"} strokeLinecap="round" opacity={0.6} />
            <circle cx="50" cy="2" r="3.5" fill={color} />
          </motion.svg>
        )}

        <motion.div
          className="relative grid size-full place-items-center rounded-full border-2 backdrop-blur-md"
          style={{
            borderColor: color,
            background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.95), ${color}26 75%, rgba(255,255,255,0.75))`,
            boxShadow: `0 12px 26px -14px ${color}, inset 0 1px 0 rgba(255,255,255,0.95)`,
          }}
          animate={running ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={running ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 20 }}
        >
          {running ? (
            <Loader2 className={cn("animate-spin", core ? "size-8" : "size-5")} style={{ color }} />
          ) : (
            <Icon className={core ? "size-8" : "size-5"} style={{ color }} strokeWidth={1.75} />
          )}
          {status === "success" && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -bottom-0.5 -right-0.5 grid size-[18px] place-items-center rounded-full border-2 border-white bg-favx-blue"
            >
              <Check className="size-2.5 text-white" strokeWidth={4} />
            </motion.span>
          )}
        </motion.div>
      </div>

      <p className="mt-2.5 text-center text-[13px] font-semibold leading-tight text-slate-800">{title}</p>
      <p className="text-center text-[10.5px] leading-tight text-slate-500">{desc}</p>

      <Handle type="source" position={Position.Right} style={{ top: size / 2, right: NODE_W / 2 - size / 2 }} />
    </div>
  );
});

/* ---------------------------------------------------------------- Aresta */

function PulseEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<PulseFlowEdge>) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.4 });
  const status = data?.status ?? "idle";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: status === "idle" ? "rgba(47,107,255,0.25)" : "#2f6bff",
          strokeWidth: status === "idle" ? 2 : 2.5,
          transition: "stroke 300ms ease",
        }}
      />
      {/* Pulso que percorre a aresta enquanto ela executa */}
      {status === "running" && (
        <circle r={5} fill="#ff3c00" style={{ filter: "drop-shadow(0 0 6px rgba(255,60,0,0.9))" }}>
          <animateMotion dur="0.6s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </>
  );
}

const nodeTypes = { favx: FavxNode };
const edgeTypes = { pulse: PulseEdge };

/* ---------------------------------------------------------------- Canvas */

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = (nodePatch: Record<string, RunStatus>, edgePatch: Record<string, RunStatus>) => {
      setNodes((nds) => nds.map((n) => (nodePatch[n.id] ? { ...n, data: { ...n.data, status: nodePatch[n.id] } } : n)));
      setEdges((eds) => eds.map((e) => (edgePatch[e.id] ? { ...e, data: { status: edgePatch[e.id] } } : e)));
    };

    if (reduce) {
      const t = setTimeout(() => {
        SCRIPT.forEach(([, n, e]) => apply(n, e));
        setFinished(true);
      }, 0);
      return () => clearTimeout(t);
    }

    const timers = SCRIPT.map(([at, n, e]) => setTimeout(() => apply(n, e), at));
    timers.push(setTimeout(() => setFinished(true), SCRIPT[SCRIPT.length - 1][0] + 300));
    return () => timers.forEach(clearTimeout);
  }, [setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.2}
      // Vitrine: dá para arrastar os nós, mas o canvas não rouba o scroll da página
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      className="favx-flow"
    >
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="rgba(47,107,255,0.18)" />
      <Panel position="bottom-center">
        <span
          className={cn(
            "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition-colors duration-300",
            "liquid-glass-soft",
            finished ? "text-favx-blue" : "text-slate-500"
          )}
        >
          {finished ? (
            <>
              <Check className="size-3.5" strokeWidth={3} /> Fluxo concluído em 1,2s
            </>
          ) : (
            <>
              <span className="size-1.5 animate-pulse rounded-full bg-favx-orange" /> Executando fluxo…
            </>
          )}
        </span>
      </Panel>
    </ReactFlow>
  );
}

export function BuilderFlow() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
