export const PARTNERSHIP_MODAL_EVENT = "urm:partnership-modal";

type PartnershipModalDetail = {
  action: "open" | "close";
};

const dispatchPartnershipModal = (detail: PartnershipModalDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PartnershipModalDetail>(PARTNERSHIP_MODAL_EVENT, { detail }));
};

export const openPartnershipModal = () => {
  dispatchPartnershipModal({ action: "open" });
};

export const closePartnershipModal = () => {
  dispatchPartnershipModal({ action: "close" });
};

export const listenPartnershipModal = (
  handler: (action: PartnershipModalDetail["action"]) => void,
) => {
  if (typeof window === "undefined") return () => {};

  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail = event.detail as PartnershipModalDetail | undefined;
    if (!detail?.action) return;
    handler(detail.action);
  };

  window.addEventListener(PARTNERSHIP_MODAL_EVENT, listener);
  return () => window.removeEventListener(PARTNERSHIP_MODAL_EVENT, listener);
};
