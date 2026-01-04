import {type FC, useMemo, useState} from "react";
import {
    DeleteIcon,
    DuplicateIcon,
    EditIcon,
    MenuVerticalIcon,
    PauseCircleIcon,
    PlayCircleIcon,
    XIcon
} from "@shopify/polaris-icons";
import {ActionList, type ActionListItemDescriptor, Button, Popover} from "@shopify/polaris";

interface Props {
    onAction: (action: string) => void;
    status: string;
}

export const CampaignActions: FC<Props> = ({ status, onAction }) => {
    const [active, setActive] = useState(false);

    const actions = useMemo(() => {
        const c_status = [
            'Processing',
            'Analyzing',
            'Importing_products',
            'Price_reverting',
            'Price_updating',
            'Duplicate_resolving'
        ];
        if (c_status.includes(status)) {
            return [
                {
                    id: 'deactivate',
                    content: 'Deactivate',
                    icon: PauseCircleIcon,
                    destructive: true,
                    onAction: () => onAction('deactivateOnRunning'),
                },
                {
                    id: 'active',
                    content: 'Active',
                    icon: PlayCircleIcon,
                    onAction: () => onAction('activeOnRunning'),
                },
            ];
        }

        const actions: ActionListItemDescriptor[] = [
            {
                id: 'duplicate',
                content: 'Duplicate',
                icon: DuplicateIcon,
                onAction: () => onAction('duplicate'),
            },
        ];

        if (status !== 'Ended') {
            actions.unshift({
                id: 'edit',
                content: 'Edit',
                icon: EditIcon,
                onAction: () => onAction('edit'),
            });
        }

        if (status === 'Draft') {
            actions.push({
                id: 'delete',
                content: 'Delete',
                destructive: true,
                icon: DeleteIcon,
                onAction: () => onAction('delete'),
            });
        }

        if(status === 'Cancelled'){
            actions.unshift({
                id: 'reactivate',
                content: 'Reactivate',
                icon: PlayCircleIcon,
                onAction: () => onAction('reactivate'),
            });
            actions.unshift({
                id: 'delete',
                content: 'Delete',
                destructive: true,
                icon: DeleteIcon,
                onAction: () => onAction('delete'),
            });
        }

        if (status === 'Inactive') {

            actions.unshift({
                id: 'reactivate',
                content: 'Reactivate',
                icon: PlayCircleIcon,
                onAction: () => onAction('reactivate'),
            });
        } else if (status === 'Active') {
            actions.unshift({
                id: 'deactivate',
                content: 'Deactivate',
                icon: PauseCircleIcon,
                destructive: true,
                onAction: () => onAction('deactivate'),
            });
        } else if (status === 'Scheduled') {
            actions.unshift({
                id: 'cancel',
                content: 'Cancel',
                icon: XIcon,
                destructive: true,
                onAction: () => onAction('cancel'),
            });
        }

        return actions;
    }, [onAction, status]);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Popover
                onClose={() => setActive(false)}
                active={active}
                activator={
                    <Button
                        onClick={() => setActive(true)}
                        icon={MenuVerticalIcon}
                    />
                }
                // activator={
                //   // <Tooltip content="Actions">
                //   //   <Button
                //   //     onClick={() => setActive(true)}
                //   //     icon={Icons.MenuVerticalIcon}
                //   //   />
                //   // </Tooltip>
                // }
            >
                <ActionList actionRole="menuitem" items={actions} />
            </Popover>
        </div>
    );
};
