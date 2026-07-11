import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RHFInputFieldProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    id: string
    label?: string
    description?: string
    placeholder?: string
    selectItems: readonly string[]
    isRequired?: boolean
    classNameField?: string
    classNameFieldContent?: string
    classNameFieldLabel?: string
    classNameFieldDescription?: string
    classNameSelectTrigger?: string
    classNameSelectValue?: string
    classNameSelectContent?: string
    classNameSelectItem?: string
    classNameFieldError?: string
}
export default function RHFSelectField<T extends FieldValues>({
    name,
    control,
    id,
    label,
    description,
    placeholder,
    selectItems,
    isRequired = false,
    classNameField,
    classNameFieldContent,
    classNameFieldLabel,
    classNameFieldDescription,
    classNameSelectTrigger,
    classNameSelectValue,
    classNameSelectContent,
    classNameSelectItem,
    classNameFieldError,
}: RHFInputFieldProps<T>) {
    const selectId = id ?? name

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field
                    data-invalid={fieldState.invalid}
                    className={classNameField}
                >
                    <FieldContent className={classNameFieldContent}>
                        {label && (
                            <FieldLabel
                                htmlFor={selectId}
                                className={cn(
                                    classNameFieldLabel,
                                    isRequired && "after:text-destructive after:content-['*']",
                                )}
                            >
                                {label}
                            </FieldLabel>
                        )}
                        {description && (
                            <FieldDescription className={classNameFieldDescription}>{description}</FieldDescription>
                        )}
                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                                className={classNameFieldError}
                            />
                        )}
                    </FieldContent>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id={selectId}
                            aria-invalid={fieldState.invalid}
                            className={classNameSelectTrigger}
                        >
                            <SelectValue
                                placeholder={placeholder}
                                className={classNameSelectValue}
                            />
                        </SelectTrigger>
                        <SelectContent
                            align='end'
                            className={classNameSelectContent}
                        >
                            {selectItems.map((item, index) => (
                                <SelectItem
                                    key={index}
                                    value={item}
                                    className={classNameSelectItem}
                                >
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            )}
        />
    )
}
