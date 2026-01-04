import { Spinner } from '@shopify/polaris';

interface SpinnerComponentProps {
    size: 'large' | 'small';
}

const SpinnerComponent = ({ size }: SpinnerComponentProps) => (
    <div className="text-center flex justify-center">
        <Spinner size={size} />
    </div>
);
export default SpinnerComponent;
