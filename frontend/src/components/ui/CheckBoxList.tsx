import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type Props = {
  id: string;
  name?: string;
  label?: string;
  List: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  // Optional cho react-hook-form trong JobCreate/JobEdit
  register?: any;
};

export const TechCheckboxGroup = ({ id, name, List, value = [], onChange, register }: Props) => {
  const fieldName = name || "technologies";

  const handleChange = (tech: string) => {
    if (!onChange) return;

    let newValue: string[];

    if (value.includes(tech)) {
      newValue = value.filter((t) => t !== tech);
    } else {
      newValue = [...value, tech];
    }

    onChange(newValue);
  };

  return (
    <FormControl component="fieldset" className="w-full">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
        {List.map((tech) => (
          <FormControlLabel
            key={tech}
            control={
              register ? (
                // Trường hợp dùng với react-hook-form (JobCreate/JobEdit)
                <Checkbox {...register(fieldName)} value={tech} defaultChecked={value.includes(tech)} />
              ) : (
                // Trường hợp dùng với state thường (trang search)
                <Checkbox name={fieldName} value={tech} checked={value.includes(tech)} onChange={() => handleChange(tech)} />
              )
            }
            label={tech}
          />
        ))}
      </div>
    </FormControl>
  );
};
