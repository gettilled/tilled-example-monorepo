export interface ITilledFieldOptions {
    fieldOptions?: { styles?: { base?: { fontFamily?: string, color?: string, fontWeight?: string, fontSize?: string } } };
    onFocus?(field: { element: Element }): void;
    onBlur?(field: { element: Element, empty: boolean }): void;
    onError?(field: { element: Element }): void;
}

const baseStyles = {
    element: ['outline-0', 'h-14', 'rounded', 'pt-4', 'pb-4', 'pl-3', 'w-full'],
    label: ['bg-white', 'absolute', 'origin-top-left', 'left-0', 'transition-all', 'pointer-events-none', '-translate-y-1/2', 'ml-2', 'pl-1', 'duration-100', 'ease-out'],
}
const blurStyles = {
    element: ['border-zinc-300', 'border', 'hover:border-zinc-500'],
    label: ['text-zinc-600'],
};
const focusStyles = {
    element: ['border-slate-700', 'border-2'],
    label: ['text-slate-700', 'top-0', 'text-xs'],
};
const errorStyles = {
    element: ['border-red-500', 'border-2'],
    label: ['text-red-500', 'top-0', 'text-xs'],
};
const emptyStyles = {
    label: ['top-1/2'],
};

const applyBaseStyles = (element: Element, label: Element | null) => {
    // element.classList.forEach(cl => {
    //     console.log(cl)
    //     element.classList.remove(cl)
    //     console.log('element.classList', element.classList)
    // });
    element.className = baseStyles.element.join(' ');
    element.classList.add(...baseStyles.element);


    if (label) label.className = baseStyles.label.join(' ');
    label?.classList.add(...baseStyles.label);
};


export const TilledFieldOptions = {
    fieldOptions: {
        styles: {
            base: {
                fontFamily:
                    '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                color: '#304166',
                fontWeight: '400',
                fontSize: '16px',
            },
            invalid: {
                ':hover': {
                    textDecoration: 'underline dotted red',
                },
                color: '#777777',
            },
            valid: {
                color: '#32CD32',
            },
        },
    },
    onFocus(field: { element: Element, valid: boolean }) {
        const { element, valid } = field;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);

        if (valid) {
            element.classList.add(...focusStyles.element);
            label?.classList.add(...focusStyles.label);
        } else {
            element.classList.add(...errorStyles.element);
            label?.classList.add(...errorStyles.label);
        }
    },
    onBlur(field: { element: Element, empty: boolean, valid: boolean }) {
        const { element, empty, valid } = field;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        if (valid) {
            element.classList.add(...blurStyles.element);
            label?.classList.add(...blurStyles.label);
        } else {
            element.classList.add(...errorStyles.element);
            label?.classList.add(...errorStyles.label);
        }

        if (empty) {
            label?.classList.remove('text-xs');
            label?.classList.add(...emptyStyles.label);
        } else {
            label?.classList.add('top-0', 'text-xs');
        }
    },
    onError(field: { element: Element }) {
        const element = field.element;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        element.classList.add(...errorStyles.element);
        label?.classList.add(...errorStyles.label);
    }
};
