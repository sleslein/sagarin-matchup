import { JSXInternal } from "https://esm.sh/v96/preact@10.11.0/src/jsx.d.ts";

export default function WeekSelection({ value }: { value: string }) {
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  // deno-lint-ignore no-explicit-any
  function onChange(evt: any) {
    window.location.href = evt.target.value;
  }

  return (
    <div class="mb-3">
      <label for="week" class="font-bold mr-3">Select a Week:</label>
      <select
        id="week"
        name="Selected Week"
        defaultValue={value}
        value={value}
        onChange={onChange}
      >
        {weeks.map((x) => {
          return <option value={x}>Week {x}</option>;
        })}
      </select>
    </div>
  );
}
