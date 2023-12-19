import { createRoot } from "react-dom/client";
import { Button } from "react-bootstrap";

import styles from "./textInputList.module.scss";

export default function TextInputList({
  listId,
  listTitle,
  addButtonText,
  removeButtonText,
}: {
  listId: string;
  listTitle: string;
  addButtonText: string;
  removeButtonText: string;
}) {
  function addInput(e: any) {
    const element = (
      <>
        <input type="text" />
        <Button
          variant="secondary"
          onClick={(e) => {
            let parentElement = e.currentTarget.parentNode;
            if (parentElement === null) return console.error("Parent is null");
            let container = parentElement.parentNode;
            if (container === null) return console.error("Container is null");
            container.removeChild(parentElement);
          }}
        >
          {removeButtonText}
        </Button>
      </>
    );

    const container = document.createElement("div");
    createRoot(container).render(element);

    let button = e.currentTarget;
    button.parentNode.insertBefore(container, button);
  }

  return (
    <div id={listId} className={styles.textInputList}>
      <p>{listTitle}</p>
      <div>
        <Button onClick={addInput}>{addButtonText}</Button>
      </div>
    </div>
  );
}
