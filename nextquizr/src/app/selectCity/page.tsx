"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import styles from "./page.module.css";

export default function SelectCity({cities}: any) {
  const router = useRouter();

  const citiesArray: string[] = cities;
 
  const [currentCity, setCurrentCity] = useState(citiesArray[0]);

  return (
    <>
    <form className={styles.citySelection}>
      <label htmlFor="city" className={styles.headerText}>Quiz about which city?</label>
      <select className={styles.citySelectionDropdown} name="city" id="city" onChange={ v => setCurrentCity(v.target.value) }>
        {citiesArray.map((c, ix) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <Link href={`/quiz?city=${currentCity}`}>Start!
        {/* <button className={styles.startButton}>Start!</button> */}
      </Link>
    </form>
    </>
  );
}
