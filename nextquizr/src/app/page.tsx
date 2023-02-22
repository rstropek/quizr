import React from "react";
import styles from "./page.module.css";

export default async function Home() {
  const citiesResponse = await fetch(
    "https://cfquizr.rstropek.com/quizzes/cities"
  );
  const cities = (await citiesResponse.json()) as string[];
  return (
    <form className={styles.citySelection} method="get" action="quiz">
      <label htmlFor="city" className={styles.headerText}>Quiz about which city?</label>
      <select className={styles.citySelectionDropdown} name="city" id="city">
        {cities.map((c, ix) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button type="submit" className={styles.startButton}>Start!</button>
    </form>
  );
}
