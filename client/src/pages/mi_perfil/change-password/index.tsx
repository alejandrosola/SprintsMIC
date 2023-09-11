import { signIn, useSession } from "next-auth/react";
import Button from "@/components/Button/Button";
import GenericForm from "@/components/Form/ValidationForm";
import { object, string, ref } from "yup";
import PasswordInput from "@/components/Input/PasswordInput";
import { changePassword } from "@/features/Users/hooks/useChangePassword";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { useState } from "react";
import Alert from "@/components/Alert/Alert";
import BasicLayout from "@/layouts/BasicLayout";
import en from "@/locale/en";
import es from "@/locale/es";

const ChangePassword: React.FC = () => {
  const { data: session } = useSession();
  const [passwordError, setError] = useState(false);

  const router = useRouter();
  const { locale } = router;
  const t = locale === "en" ? en : es;

  const isActualPasswordValid = function () {
    return passwordError;
  };

  const initialValues = {
    acualPassword: "",
    newPassword: "",
    checkNewPassword: "",
  };

  const fields = [
    {
      name: "actualPassword",
      label: "Campo 1",
      props: { label: "Contraseña actual" },
      component: PasswordInput,
    },
    {
      name: "newPassword",
      label: "Campo 2",
      props: { label: "Contraseña nueva" },
      component: PasswordInput,
    },
    {
      name: "checkNewPassword",
      label: "Campo 3",
      props: { label: "Confirmar contraseña nueva" },
      component: PasswordInput,
    },
  ];

  const handleButtonClick = async (values: Record<string, any>) => {
    setError(false);
    const user = {
      email: session!.user?.email,
      actualPassword: values.actualPassword,
      newPassword: values.newPassword,
      checkNewPassword: values.checkNewPassword,
    };
    const response = await changePassword(user.email!, user);
    if (response.statusCode === 200) {
      router.push(
        {
          pathname: `/mi_perfil`,
          query: { message: response.message },
        }
      );
    } else {
      setError(true);
    }
  };

  const validationSchema = object().shape({
    actualPassword: string().required(t["passwordrequired"]),
    newPassword: string()
      .required("*Contraseña nueva requerida")
      .min(8, t["eightchar"])
      .matches(
        /(?=.*[A-Z])(?=.*?[0-9])/,
        "Debe tener al menos 8 caracteres, una mayúscula y un número"
      ),
    checkNewPassword: string().oneOf(
      [ref("newPassword")],
      "Las contraseñas deben coincidir"
    ),
  });

  return (
    <div>
      <MainLayout>
        {isActualPasswordValid() ? (
          <Alert label="Contraseña incorrecta" severity="error" />
        ) : (
          <></>
        )}
        {session ? (
          <div>
            <BasicLayout title="Cambiar contraseña">
              <GenericForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                fields={fields}
                onSubmit={handleButtonClick}
                buttonLabel="Cambiar contraseña"
              />
            </BasicLayout>
          </div>
        ) : (
          <Button label={"Sign In"} onClick={() => signIn()}></Button>
        )}
      </MainLayout>
    </div>
  );
};

export default ChangePassword;
