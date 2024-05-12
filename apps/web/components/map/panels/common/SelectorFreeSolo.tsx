import type { SelectorItem } from "@/types/map/common";

interface SelectorFreeSoloProps {
  label?: string;
  tooltip?: string;
  selectedItem: SelectorItem | undefined;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: string) => void;
}

const SelectorFreeSolo = (props: SelectorFreeSoloProps) => {
  console.log(props);
  return <></>;
};

export default SelectorFreeSolo;
