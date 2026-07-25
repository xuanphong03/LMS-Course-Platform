'use client'
import { cn } from '@/lib/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Uploader } from '@/components/file-uploader'

interface RHFFileUploaderProps<T extends FieldValues> {
    id: string
    name: Path<T>
    control: Control<T>
    label?: string
    placeholder?: string
    description?: string
    isRequired?: boolean
    classNameField?: string
    classNameFieldLabel?: string
    classNameFieldError?: string
    classNameFieldDescription?: string
    fileType?: 'image' | 'video'
}
export default function RHFFileUploader<T extends FieldValues>({
    id,
    name,
    control,
    label,
    description,
    isRequired = false,
    classNameField,
    classNameFieldLabel,
    classNameFieldError,
    classNameFieldDescription,
    fileType,
}: RHFFileUploaderProps<T>) {
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
                            htmlFor={id}
                            className={cn(
                                classNameFieldLabel,
                                isRequired && "after:text-destructive after:content-['*']",
                            )}
                        >
                            {label}
                        </FieldLabel>
                    )}
                    <Uploader
                        id={id}
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted={fileType ?? 'image'}
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
