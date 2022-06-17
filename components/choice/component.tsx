import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { ChoiceProps } from "./props";

export function Alternative({ alternative, className="" }: ChoiceProps) {

  return (
    <Card className={`w-11/12 mt-10  ${className}`}>
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
