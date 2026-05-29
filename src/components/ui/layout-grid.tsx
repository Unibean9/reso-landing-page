"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BANNER_ASPECT = "aspect-[16/10]" as const;

export type LayoutGridCard = {
  id: string | number;
  content: React.ReactNode;
  thumbnail: string;
  /** Natural image dimensions — used to preserve aspect ratio without cropping */
  width?: number;
  height?: number;
  /** Spans both columns — use for hero/featured cards to create visual variety */
  featured?: boolean;
};

type CardHandlers = {
  selected: LayoutGridCard | null;
  lastSelected: LayoutGridCard | null;
  onSelect: (card: LayoutGridCard) => void;
};

function GridCard({ card, ...handlers }: { card: LayoutGridCard } & CardHandlers) {
  const isSelected = handlers.selected?.id === card.id;

  return (
    <motion.div
      onClick={() => handlers.onSelect(card)}
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-xl",
        isSelected &&
          "absolute inset-0 z-50 m-auto flex aspect-auto h-1/2 w-full max-w-3xl flex-col flex-wrap items-center justify-center rounded-lg md:w-1/2",
        !isSelected && handlers.lastSelected?.id === card.id && "z-40",
      )}
      layoutId={`card-${card.id}`}
    >
      {isSelected && <SelectedCard selected={handlers.selected} />}
      <motion.img
        layoutId={`image-${card.id}-image`}
        src={card.thumbnail}
        width={card.width ?? 1600}
        height={card.height ?? 1000}
        className="block h-auto w-full"
        alt=""
      />
    </motion.div>
  );
}

export const LayoutGrid = ({
  cards,
  className,
}: {
  cards: LayoutGridCard[];
  className?: string;
}) => {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridCard | null>(null);

  const handleClick = (card: LayoutGridCard) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  if (cards.length === 0) return null;

  const handlers: CardHandlers = {
    selected,
    lastSelected,
    onSelect: handleClick,
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.id} className={cn("min-w-0", card.featured && "col-span-2")}>
            <GridCard card={card} {...handlers} />
          </div>
        ))}
      </div>

      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute inset-0 z-10 bg-black opacity-0",
          selected?.id ? "pointer-events-auto" : "pointer-events-none",
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const SelectedCard = ({ selected }: { selected: LayoutGridCard | null }) => {
  return (
    <div className="relative z-60 flex h-full w-full flex-col justify-end rounded-lg bg-transparent shadow-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-10 h-full w-full bg-black opacity-60"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-70 px-8 pb-4"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
