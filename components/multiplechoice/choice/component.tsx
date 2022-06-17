import { Card } from "flowbite-react";
import { ChoiceProps } from "./props";

export function Alternative({ alternative, classNames=[""] }: ChoiceProps) {
  return (
    <Card className={`w-11/12 mt-10  hover:cursor-pointer ${classNames.toString().replace(","," ")}`}>

      <div
        className={`h-full w-full flex flex-col justify-center `}
    
      >
        <div
          className={`text-center text-3xl font-semibold tracking-widest`}
        >
          {alternative}
        </div>
      </div>
    </Card>
  );
}
