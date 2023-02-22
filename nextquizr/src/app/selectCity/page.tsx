"use client";

// Note that this is a client component. Read more about client components at
// https://beta.nextjs.org/docs/rendering/server-and-client-components#client-components

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import "../globals.css";

export default function SelectCity({ cities }: any) {
  const router = useRouter();

  // Note that the type of the parameter cities is any because of a bug in the
  // current preview version of Next.js. Read more at https://github.com/vercel/next.js/issues/45088.
  // Therefore, we need to cast the parameter to the correct type.
  const citiesArray: string[] = cities;

  // We use the useState hook to keep track of the currently selected city.
  const [currentCity, setCurrentCity] = useState(citiesArray[0]);

  return (
    <>
      <label htmlFor="city" className={styles.headerText}>
        Quiz about which city?
      </label>
      <select
        className={styles.citySelectionDropdown}
        name="city"
        id="city"
        onChange={(v) => setCurrentCity(v.target.value)}
      >
        {citiesArray.map((c, ix) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Link className={styles.startButton} href={`/quiz?city=${currentCity}`}>
        Start!
      </Link>
    </>
  );
}
