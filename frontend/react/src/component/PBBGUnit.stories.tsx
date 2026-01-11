import type { Meta, StoryObj } from "@storybook/react";
import PBBGUnit, { Unit } from "./PBBGUnit";

const meta = {
  title: "Components/PBBGUnit",
  component: PBBGUnit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PBBGUnit>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUnit: Unit = {
  name: "Flamango",
  idleAnimationURL: "/img/unit/flamango.gif",
  hp: 22,
  maxHP: 22,
  atk: 13,
  def: 14,
  levelProgress: {
    level: 1,
    relativeExp: 0,
    relativeExpToNextLevel: 100,
  },
};

export const Default: Story = {
  args: {
    unit: mockUnit,
  },
};

export const FacingLeft: Story = {
  args: {
    unit: mockUnit,
    facing: "left",
  },
};

export const LowHealth: Story = {
  args: {
    unit: {
      ...mockUnit,
      hp: 5,
    },
  },
};

export const Dead: Story = {
  args: {
    unit: {
      ...mockUnit,
      hp: 0,
    },
  },
};

export const HasExp: Story = {
  args: {
    unit: {
      ...mockUnit,
      levelProgress: {
        ...mockUnit.levelProgress,
        relativeExp: 73,
      },
    },
  },
};
