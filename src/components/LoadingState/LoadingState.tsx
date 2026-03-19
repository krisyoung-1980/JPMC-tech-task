import styles from "./LoadingState.module.css";

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = "Loading" }: LoadingStateProps) => (
  <div className={styles.loading} role="status" aria-label={label}>
    <div className={styles.spinner} aria-hidden="true" />
    {label}…
  </div>
);
