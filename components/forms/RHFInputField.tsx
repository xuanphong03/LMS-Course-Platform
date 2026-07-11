'use client'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RHFInputFieldProps<T extends FieldValues> extends React.ComponentProps<'input'> {
    name: Path<T>
    control: Control<T>
    id: string
    label?: string
    placeholder?: string
    description?: string
    isRequired?: boolean
    classNameField?: string
    classNameFieldLabel?: string
    classNameInput?: string
    classNameFieldDescription?: string
    classNameFieldError?: string
}
export default function RHFInputField<T extends FieldValues>({
    name,
    control,
    id,
    label,
    placeholder,
    description,
    isRequired = false,
    classNameField,
    classNameFieldLabel,
    classNameInput,
    classNameFieldError,
    classNameFieldDescription,
    ...inputProps
}: RHFInputFieldProps<T>) {
    const inputId = id ?? name

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field
                    className={classNameField}
                    data-invalid={fieldState.invalid}
                >
                    {label && (
                        <FieldLabel
                            htmlFor={inputId}
                            className={cn(
                                classNameFieldLabel,
                                isRequired && "after:text-destructive after:content-['*']",
                            )}
                        >
                            {label}
                        </FieldLabel>
                    )}
                    <Input
                        id={inputId}
                        className={classNameInput}
                        placeholder={placeholder}
                        {...inputProps}
                        {...field}
                    />
                    {description && (
                        <FieldDescription className={classNameFieldDescription}>{description}</FieldDescription>
                    )}
                    {fieldState.error && (
                        <FieldError className={classNameFieldError}>{fieldState.error.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}
