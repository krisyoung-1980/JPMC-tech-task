import styles from "./ErrorPanel.module.css";

interface ErrorPanelProps {
  title: string;
  message: string;
}

export const ErrorPanel = ({ title, message }: ErrorPanelProps) => (
  <div className={styles.error} role="alert">
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"
        fill="currentColor"
      />
      <path
        d="M8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
    </svg>
    <div>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
    </div>
  </div>
);
