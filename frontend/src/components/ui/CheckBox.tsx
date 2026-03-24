import Checkbox from "@mui/material/Checkbox";

export const CheckBox = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      slotProps={{
        input: { "aria-label": "controlled" },
      }}
    />
  );
};
