import { FinancialInstrumentsTable } from "./components/FinancialInstrumentsTable";
import styles from "./App.module.css";

const App = () => (
  <main className={styles.app}>
    <h1 className={styles["app__heading"]}>Financial Instruments</h1>
    <FinancialInstrumentsTable />
  </main>
);

export default App;
