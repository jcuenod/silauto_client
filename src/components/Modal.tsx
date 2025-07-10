import React, { type ReactNode, useEffect, useRef, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ANIMATION_DURATION = 250; // ms

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const [visible, setVisible] = useState(open);
  const [animateIn, setAnimateIn] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // Wait for next tick to trigger animation
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      timeoutRef.current = window.setTimeout(
        () => setVisible(false),
        ANIMATION_DURATION
      );
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: animateIn ? 1 : 0,
        transition: `opacity ${ANIMATION_DURATION}ms`,
        pointerEvents: open ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 300,
          minHeight: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transform: animateIn ? "translateY(0)" : "translateY(-40px)",
          opacity: animateIn ? 1 : 0,
          transition: `opacity ${ANIMATION_DURATION}ms, transform ${ANIMATION_DURATION}ms`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface ModalWithHeaderProps extends ModalProps {
  header: string;
  showX: boolean;
}

export const ModalWithHeader = ({
  open,
  onClose,
  children,
  header,
  showX,
}: ModalWithHeaderProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div className="flex flex-row items-center justify-between">
          <div>{header}</div>
          {showX && <button onClick={onClose}>✕</button>}
        </div>
        {children}
      </div>
    </Modal>
  );
};

export default Modal;
