import React from "react"
import { Field, FieldProps } from "formik"

interface TextFieldProps {
  field: string
  label_text?: string
  placeholder?: string
  type?: string
  isDisabled?: boolean
  Icon?: React.ElementType
  className?: string
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  label_text,
  placeholder = "",
  type = "text",
  isDisabled = false,
  Icon,
  className = ""
}) => {
  return (
    <div className="mb-4">
      {label_text && (
        <label htmlFor={field} className="block mb-1 text-sm font-medium text-gray-700">
          {label_text}
        </label>
      )}
      <Field name={field}>
        {({ field, meta }: FieldProps) => (
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            )}
            <input
              {...field}
              id={field.name}
              type={type}
              disabled={isDisabled}
              placeholder={placeholder}
              className={`w-full px-3 py-2 rounded-md bg-white text-gray-800 placeholder-gray-400 
                outline-none border-2 focus:border-gray-300 transition-all
                ${Icon ? "pl-10" : ""}
                ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${meta.touched && meta.error ? "border-red-400" : "border-gray-200"}
                ${meta.touched && !meta.error ? "border-green-400" : ""}
                ${className}`}
            />
            {meta.touched && meta.error && (
              <p className="error-message">{meta.error}</p>
            )}
            {meta.touched && !meta.error && (
              <p className="success-message">Looks good!</p>
            )}
          </div>
        )}
      </Field>
    </div>
  )
}

export default TextField

