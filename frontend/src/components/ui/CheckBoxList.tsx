import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type Props = {
  register: any;
  id: string;
  label?: string;
  List: string[];
  value?: string[];
};

export const TechCheckboxGroup = ({ register, id, List, value = [] }: Props) => {
  return (
    <FormControl component="fieldset" className="w-full">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
        {List.map((tech) => (
          <FormControlLabel
            id={id}
            key={tech}
            control={
              <Checkbox
                {...register("technologies")}
                value={tech}
                defaultChecked={value.includes(tech)} // 👈 check sẵn
              />
            }
            label={tech}
          />
        ))}
      </div>
    </FormControl>
  );
};
