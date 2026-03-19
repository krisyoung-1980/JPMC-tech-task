import styles from "./LoadingState.module.css";

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = "Loading" }: LoadingStateProps) => (
  <div className={styles.loading} role="status" aria-label={label}>
    <div className={styles["loading__spinner"]} aria-hidden="true" />
    {label}…
  </div>
);
