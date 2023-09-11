import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Button/Button';

interface FieldConfig {
	name: string;
	component: React.FC<any>;
	props: any;
}

interface GenericFormProps {
	initialValues: Record<string, any>;
	validationSchema: Yup.Schema<any>;
	fields: FieldConfig[];
	onSubmit: (values: Record<string, any>, actions: any) => void;
	buttonLabel: string;
	cancelLabel?: string;
	isCancelable?: boolean; // New prop for cancel button
	onCancel?: () => void; // New prop for cancel function
}

const GenericForm: React.FC<GenericFormProps> = ({
	initialValues,
	validationSchema,
	fields,
	buttonLabel = 'Confirmar',
	cancelLabel = 'Cancelar',
	onSubmit,
	isCancelable = false,
	onCancel,
}) => {
	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ isSubmitting, errors, touched }) => (
				<Form>
					<div style={{ width: '35vw' }}>
						{fields.map((field) => (
							<div key={field.name} style={{ marginBottom: '14px' }}>
								<Field
									name={field.name}
									as={field.component}
									{...field.props}
								/>

								{errors[field.name] && touched[field.name] && (
									<span style={{ color: 'red' }}>
										<ErrorMessage name={field.name} />
									</span>
								)}
							</div>
						))}
						<div
							style={{
								display: 'flex',
								justifyContent: isCancelable ? 'space-around' : 'center',
							}}
						>
							{isCancelable && onCancel && (
								<Button type='button' label={cancelLabel} onClick={onCancel} />
							)}
							<Button
								type='submit'
								label={buttonLabel}
								disabled={isSubmitting}
							/>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default GenericForm;
