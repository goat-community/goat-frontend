"use client";

import { postOrganizationSchema } from "@/lib/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import AuthContainer from "@p4b/ui/components/AuthContainer";

type FormData = z.infer<typeof postOrganizationSchema>;

type ResponseResult = {
  message: string;
  status?: "error" | "success";
};

export default function OrganizationCreate() {
  const router = useRouter();
  const theme = useTheme();
  const { status, update } = useSession();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [responseResult, setResponseResult] = useState<ResponseResult>({
    message: "",
    status: undefined,
  });
  const REGIONS = [
    {
      name: "EU",
      value: "eu",
    },
  ];

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(postOrganizationSchema),
    defaultValues: {
      region: "eu",
    },
  });

  async function onSubmit(data: FormData) {
    setResponseResult({ message: "", status: undefined });

    setIsBusy(true);
    const response = await fetch(`/api/auth/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    setIsBusy(false);
    if (!response.ok) {
      setResponseResult({
        message: responseJson.detail,
        status: "error",
      });
      return;
    }
    update();
    router.push("/");
  }

  return (
    <>
      {status == "authenticated" && (
        <AuthContainer
          headerTitle="Create organization"
          headerAlert={
            responseResult.status && (
              <Alert severity={responseResult.status}>
                {responseResult.message}
              </Alert>
            )
          }
          body={
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={theme.spacing(4)}>
                <TextField
                  fullWidth
                  helperText={errors.name ? errors.name?.message : null}
                  label="Organization Name"
                  id="name"
                  {...register("name")}
                  error={errors.name ? true : false}
                />
                <TextField
                  fullWidth
                  select
                  defaultValue={REGIONS[0].value}
                  label="Region"
                  size="medium"
                  {...register("region")}
                >
                  {REGIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Button
                sx={{ mt: theme.spacing(8) }}
                fullWidth
                ref={submitButtonRef}
                name="login"
                type="submit"
                disabled={!isDirty || !isValid || isBusy}
              >
                Get started!
              </Button>
            </Box>
          }
        />
      )}
    </>
  );
}
