import { useEffect, useState } from "react";
import {
    Button,
    Collapsible,
    TextField,
    Modal,
    TextContainer,
} from "@shopify/polaris";
import SwitchWithLoading from "../common/switch-with-loading";
import { BASE_URL } from "../../config";

const AppControlCard = ({
                            store,
                            setReFetch,
                        }: {
    store: any;
    setReFetch: (value: any) => void;
}) => {
    const [devLoading, setDevLoading] = useState(false);
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [sessionDeleteLoading, setSessionDeleteLoading] = useState(false);
    const [productHideLoading, setProductHideLoading] = useState(false);
    // @ts-ignore
    const [storeFrontLogLoading, setStoreFrontLogLoading] = useState(false);
    const [uninstallLoading, setUninstallLoading] = useState(false);

    const [hideSelector, setHideSelector] = useState("");
    const [open, setOpen] = useState(false);
console.log("dfgdf", store)
    // SUSPEND MODAL STATE
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [suspendModalReason, setSuspendModalReason] = useState("");
    const [suspendModalError, setSuspendModalError] = useState<string | null>(
        null
    );

    // LOCAL UI STATE (so we don't depend only on props)
    const [localAppStatus, setLocalAppStatus] = useState<string | undefined>(
        store?.appStatus
    );
    const [localDevelopment, setLocalDevelopment] = useState<boolean>(
        !!store?.development
    );
    const [suspendReasonDisplay, setSuspendReasonDisplay] = useState(
        store?.suspendReason ?? ""
    );

    const isBlocked = localAppStatus === "BLOCKED";

    // keep local state in sync when parent `store` changes (e.g. after reload or parent refetch)
    useEffect(() => {
        setDevLoading(false);
        setSuspendLoading(false);
        setSessionDeleteLoading(false);
        setProductHideLoading(false);
        setStoreFrontLogLoading(false);
        setUninstallLoading(false);

        console.log("resload store", store);
        setLocalAppStatus(store?.appStatus);
        setLocalDevelopment(!!store?.development);
        setSuspendReasonDisplay(store?.suspendReason ?? "");
    }, [
        store?.id,
        store?.appStatus,
        store?.development,
        store,
        store?.suspendReason,
    ]);

    const callAdminAppControl = async (
        payload: any,
        setLoading: (val: boolean) => void
    ) => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });

            const res = await fetch(
                `${BASE_URL}/admin-app-control?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const data = await res.json();

            if (data.ok || data.success) {
                // let parent optionally refetch
                setReFetch((prev: boolean) => !prev);
                return true;
            } else {
                console.error("Admin app control error:", data.error || data);
                return false;
            }
        } catch (err) {
            console.error("Error calling admin-app-control:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // DEVELOPMENT TOGGLE
    const handleDevelopmentToggle = () => {
        if (!store) return;

        const nextDev = !localDevelopment;

        callAdminAppControl(
            {
                type: "setDevelopment",
                storeId: store.id,
                development: nextDev,
            },
            setDevLoading
        ).then((ok) => {
            if (ok) {
                setLocalDevelopment(nextDev); // update UI immediately
            }
        });
    };

    // SUSPEND SWITCH CLICK
    const handleSuspendToggle = () => {
        if (!store) return;

        if (isBlocked) {
            // Already blocked -> unsuspend directly
            callAdminAppControl(
                {
                    type: "ready",
                    storeId: store.id,
                },
                setSuspendLoading
            ).then((ok) => {
                if (ok) {
                    setLocalAppStatus("READY");
                    setSuspendReasonDisplay("");
                }
            });
        } else {
            // Not blocked yet -> open modal to collect reason
            setSuspendModalReason("");
            setSuspendModalError(null);
            setSuspendModalOpen(true);
        }
    };

    // CONFIRM SUSPEND FROM MODAL
    const handleConfirmSuspend = async () => {
        if (!store) return;

        if (!suspendModalReason.trim()) {
            setSuspendModalError("Please enter a reason for suspending this store.");
            return;
        }

        setSuspendModalError(null);

        const ok = await callAdminAppControl(
            {
                type: "block",
                storeId: store.id,
                suspendReason: suspendModalReason.trim(),
            },
            setSuspendLoading
        );

        if (ok) {
            setLocalAppStatus("BLOCKED");
            setSuspendReasonDisplay(suspendModalReason.trim());
            setSuspendModalOpen(false);
        }
    };

    const handleCloseSuspendModal = () => {
        if (suspendLoading) return; // prevent closing while request in-flight
        setSuspendModalOpen(false);
    };

    // SESSION DELETE
    const handleSessionDelete = () => {
        if (!store) return;

        callAdminAppControl(
            {
                type: "deleteSessions",
                storeId: store.id,
            },
            setSessionDeleteLoading
        );
    };

    // APP UNINSTALL
    const handleAppUninstalled = () => {
        if (!store) return;

        // optional: confirm in UI
        if (!window.confirm("Are you sure you want to uninstall this app?")) {
            return;
        }

        callAdminAppControl(
            {
                type: "uninstall",
                storeId: store.id,
            },
            setUninstallLoading
        ).then((ok) => {
            if (ok) {
                // you could also optimistically update status here if you want
                console.log("Uninstall initiated for store", store.id);
            }
        });
    };

    // ---- old project extras (product hide / store front log) ----

    const handleStoreFrontLog = () => {
        setStoreFrontLogLoading(true);
        const formData = new FormData();
        formData.append("storeId", store.id);
        formData.append("action", "storeFrontLog");

        fetch(`${BASE_URL}/admin/api/subscriber`, {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const data = await res.json();
                if (data.success) {
                    setReFetch((prev: boolean) => !prev);
                } else {
                    console.error(data.error);
                }
            })
            .catch((err) => {
                console.error("Error updating store status:", err);
            })
            .finally(() => {
                setStoreFrontLogLoading(false);
            });
    };

    const handleProductHide = () => {
        setProductHideLoading(true);
        handleStoreFrontLog();
        const formData = new FormData();
        formData.append("action", "productHide");
        formData.append("storeId", store.id);
        formData.append("hideSelector", hideSelector as any);

        fetch(`${BASE_URL}/admin/api/subscriber`, {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const data = await res.json();
                if (data.success) {
                    setReFetch((prev: boolean) => !prev);
                    setOpen(false);
                } else {
                    console.error(data.error);
                }
            })
            .catch((err) => {
                console.error("Error updating store status:", err);
            })
            .finally(() => {
                setProductHideLoading(false);
            });
    };

    return (
        <>
            <div
                className="rounded-lg shadow-sm p-4 h-full"
                style={{ backgroundColor: "#b6d6ff" }}
            >
                <span className="text-lg font-bold">App Control</span>

                {/* Development flag / app status */}
                <div className="flex justify-between mt-2">
                    <span className="text-lg">App status (development)</span>
                    {store && (
                        <SwitchWithLoading
                            switchOn={!localDevelopment}
                            handleSwitch={handleDevelopmentToggle}
                            isLoading={devLoading}
                        />
                    )}
                </div>

                {/* Suspend (BLOCK / READY) */}
                <div className="flex flex-col my-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg">Suspend</span>
                        {store && (
                            <SwitchWithLoading
                                switchOn={isBlocked}
                                handleSwitch={handleSuspendToggle}
                                isLoading={suspendLoading}
                            />
                        )}
                    </div>

                    {isBlocked && suspendReasonDisplay && (
                        <div className="mt-2 text-sm text-red-900 bg-red-50 border border-red-200 rounded p-2">
                            <strong>Suspension reason:</strong> {suspendReasonDisplay}
                        </div>
                    )}
                </div>

                {/* Session delete */}
                <div className="flex justify-between my-3 items-center">
                    <span className="text-lg">Session delete</span>
                    <Button
                        size="slim"
                        variant="primary"
                        onClick={handleSessionDelete}
                        loading={sessionDeleteLoading}
                    >
                        Delete sessions
                    </Button>
                </div>

                {/* Uninstall */}
                <div className="flex justify-between my-3 items-center">
                    <span className="text-lg">Uninstall</span>
                    <Button
                        // disabled={!!store.uninstalledAt}
                        size="slim"
                        variant="primary"
                        tone="critical"
                        onClick={handleAppUninstalled}
                        loading={uninstallLoading}
                    >
                        {store.uninstalledAt ? "Uninstalled" : "Uninstall app"}

                    </Button>
                </div>

                {/* Optional product-hide UI */}
                <div className="my-2">
                    <Collapsible
                        open={open}
                        id="basic-collapsible"
                        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                        expandOnPrint
                    >
                        <TextField
                            label="Search Class Selector"
                            placeholder=".grid-item"
                            helpText={`Enter the CSS class to hide the shipping protection product on your store (e.g., .grid-item).`}
                            autoComplete="off"
                            maxLength={70}
                            showCharacterCount
                            value={hideSelector}
                            onChange={(value) => setHideSelector(value)}
                        />
                        <div className="flex justify-end ">
                            <Button
                                size="slim"
                                variant="primary"
                                onClick={handleProductHide}
                                disabled={!hideSelector}
                                loading={productHideLoading}
                            >
                                Save
                            </Button>
                        </div>
                    </Collapsible>
                </div>
            </div>

            {/* Suspend modal */}
            <Modal
                open={suspendModalOpen}
                onClose={handleCloseSuspendModal}
                title="Suspend this store"
                primaryAction={{
                    content: "Suspend",
                    destructive: true,
                    onAction: handleConfirmSuspend,
                    loading: suspendLoading,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleCloseSuspendModal,
                        disabled: suspendLoading,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            This will set the app status to <b>BLOCKED</b> for this store and
                            prevent it from using your app.
                        </p>
                        <TextField
                            label="Suspend reason"
                            placeholder="Why are you suspending this store?"
                            autoComplete="off"
                            value={suspendModalReason}
                            maxLength={250}
                            multiline={3}
                            showCharacterCount
                            onChange={(value) => {
                                setSuspendModalReason(value);
                                if (suspendModalError) setSuspendModalError(null);
                            }}
                            error={suspendModalError || undefined}
                        />
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </>
    );
};

export default AppControlCard;
