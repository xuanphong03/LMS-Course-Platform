'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RHFTextareaFieldProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    id: string
    label?: string
    placeholder?: string
    description?: string
    isRequired?: boolean
    classNameField?: string
    classNameFieldLabel?: string
    classNameTextarea?: string
    classNameFieldError?: string
    classNameFieldDescription?: string
}
export default function RHFTextareaField<T extends FieldValues>({
    name,
    control,
    id,
    label,
    placeholder,
    description,
    isRequired = false,
    classNameField,
    classNameFieldLabel,
    classNameTextarea,
    classNameFieldDescription,
    classNameFieldError,
}: RHFTextareaFieldProps<T>) {
    const textareaId = id ?? name

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
                            htmlFor={textareaId}
                            className={cn(
                                classNameFieldLabel,
                                isRequired && "after:text-destructive after:content-['*']",
                            )}
                        >
                            {label}
                        </FieldLabel>
                    )}
                    <Textarea
                        id={textareaId}
                        className={classNameTextarea}
                        placeholder={placeholder || ''}
                        {...field}
                    />
                    {description && <FieldError className={classNameFieldDescription}>{description}</FieldError>}
                    {fieldState.error && (
                        <FieldError className={classNameFieldError}>{fieldState.error.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}
