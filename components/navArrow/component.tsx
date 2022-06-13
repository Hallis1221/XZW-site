/* Icons */
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
} from "@heroicons/react/solid";
import { NavArrowProps } from "./props";

export function NavArrow({
  onClick,
  right = false,
  left = false,
}: NavArrowProps) {
  return (
    <div
      className="bg-transparent w-1/6 hidden md:flex justify-center"
      onClick={() => onClick()}
    >
      <div className="h-full flex flex-col justify-center ">
        {right ? (
          <ArrowRightIcon className="h-24 mb-24 " />
        ) : left ? (
          <ArrowLeftIcon className="h-24 mb-24 " />
        ) : (
          <ArrowDownIcon className="h-24 mb-24" />
        )}
      </div>
    </div>
  );
}
