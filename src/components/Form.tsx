import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { z } from "zod";

import Plus from "../icons/plus";
import { createGuest } from "../DB/api";
import { Guest } from "../types";
import ErrorBar from "./ErrorBar";

const msg =
  "ניתן להזמין עד עשר מנות ללא גלוטן, במקרה הצורך אנא צור קשר עם איטה ספרנאי או גלי אמיר";

// const guestSchema = z.object({
//   first_name: z.string(),
//   last_name: z.string(),
//   phone: z.string(),
//   guests: z.array(z.object({ name: z.string() })),
//   gluten_free: z.number().min(0).max(10, { message: msg }),
//   vegan: z.number().min(0).max(10, { message: msg }),
//   coming: z.string(),
//   not_coming: z.string().optional(),
// });

export default function Form() {
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Guest>({
    defaultValues: {
      guests: [{ name: "" }],
    },
  });

  const { fields, append } = useFieldArray({ name: "guests", control });

  const addGuest = () => {
    append({ name: "" });
  };

  const onSubmit = async (data: any) => {
    const error = await createGuest(data); // TODO - create option for update, not an error
    if (error) {  
      setError("root", { message: error });
      alert("ניתן לאשר הגעה פעם אחת בלבד, מייל זה כבר מופיע במערכת");
    } else {
      reset();
      navigate("/Confirm");
    }
  };

  return (
    <div>
      <div className="text-center text-lg">
        <h2 className="font-bold text-2xl">אישור הגעה</h2>
        <p>נשמח לראותכם בין אורחינו</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="שם פרטי"
              {...register("first_name", {
                required: "שם פרטי הינו חובה",
                minLength: {
                  value: 2,
                  message: "שם פרטי קצר מדי, אנא הזן לפחות 2 תווים",
                },
                maxLength: {
                  value: 15, // TODO - change to 30
                  message: "שם פרטי ארוך מדי, אנא הזן עד 15 תווים",
                },
                pattern: {
                  value: /^[א-ת\s]+$/i, // TODO - add english letters
                  message:
                    "שם פרטי מכיל תווים שאינם אותיות בעברית, אנא נסה שוב", // TODO - add english letters
                },
              })}
              aria-invalid={errors.first_name ? "true" : "false"}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorBar error={errors.first_name} />
        </div>

        <div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="שם משפחה"
              {...register("last_name", {
                required: "שם משפחה הינו חובה",
                minLength: {
                  value: 2,
                  message: "שם משפחה קצר מדי, אנא הזן לפחות 2 תווים",
                },
                maxLength: {
                  value: 15, // TODO - change to 30
                  message: "שם משפחה ארוך מדי, אנא הזן עד 15 תווים",
                },
                pattern: {
                  value: /^[א-ת\s]+$/i, // TODO - add english letters
                  message:
                    "שם משפחה מכיל תווים שאינם אותיות בעברית, אנא נסה שוב", // TODO - add english letters
                },
              })}
              aria-invalid={errors.last_name ? "true" : "false"}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorBar error={errors.last_name} />
        </div>

        <div>
          <div className="mt-3">
            <input
              type="tel"
              placeholder="מספר טלפון נייד"
              {...register("phone", {
                required: "מספר טלפון הינו חובה",
                pattern: {
                  value: /^(05\d{8}|0\d{9})$/, // TODO - change to (?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})
                  message: "אנא הזן מספר תקין",
                },
              })}
              aria-invalid={errors.phone ? "true" : "false"}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 text-right"
            />
          </div>
          <ErrorBar error={errors.phone} />
        </div>
              /* TODO - Change text to mark number of people coming */
        <label> 
          <div className="text-lg mt-6">
            <span>הוסף את שמות בני המשפחה שבאים</span>
          </div>

          <div className=" mb-2 text-sm">
            <p className="text-sm">* אנא וודא שכל אדם נרשם פעם אחת בלבד</p>
            <p>* אין צורך לרשום ילדים מגיל שש ומטה</p> // TODO - change to 3
          </div>

          <div className="flex items-end gap-2 mb-4"> // TODO - change to number of people coming
            <div className="flex flex-col gap-1">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="שם מלא"
                      className="input input-bordered input-sm"
                      {...register(`guests.${index}.name`, {
                        minLength: {
                          value: 2,
                          message: "שם מלא קצר מדי, אנא הזן לפחות שני תווים",
                        },
                        maxLength: {
                          value: 15,
                          message: "שם מלא ארוך מדי, אנא הזן עד 15 תווים",
                        },
                        pattern: {
                          value: /^[א-ת\s]+$/i,
                          message: "אנא הזן שם בעברית בלבד",
                        },
                      })}
                    />
                    {index === fields.length - 1 && (
                      <button className="w-6 cursor-pointer" onClick={addGuest}>
                        <Plus />
                      </button>
                    )}
                  </div>
                  {errors && errors.guests && errors.guests[index]?.name && (
                    <div
                      className="px-4 py-1 mb-4 ml-8 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span className="font-medium">
                        {errors?.guests[index]?.name?.message}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </label>

        <div className="mb-4"> 
          <div className="form-control">
            <label className="label cursor-pointer flex justify-start">
              <input
                {...register("coming", { required: true })}
                type="radio"
                value="coming"
                className="radio"
                name="coming"
              />
              <span className="label-text mr-2">מגיעים</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer flex justify-start">
              <input
                {...register("coming", { required: true })}
                type="radio"
                value="not_coming"
                className="radio"
                name="coming"
              />
              <span className="label-text mr-2">לא מגיעים</span>
            </label>
          </div>
        </div>
        {errors.coming && (
          <div
            className="px-4 py-1 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">
              {errors.coming.message || "אנא בחר באחת מהאפשרויות"}
            </span>
          </div>
        )}
        // TODO - Remove this section
        <div className="text-lg">
          <p>בקשת מנה מיוחדת</p>
        </div>

        <div className="mb-6  gap-3">
          <label>
            <div>
              <span>ללא גלוטן</span>
            </div>
            <input
              className="input input-bordered input-sm w-44"
              type="number"
              placeholder="0"
              {...register("gluten_free", {
                min: { value: 0, message: msg },
                max: { value: 10, message: msg },
              })}
            />
            <ErrorBar error={errors.gluten_free} />
          </label>

          <label>
            <div>
              <span>טבעוני</span>
            </div>
            <input
              className="input input-bordered input-sm w-44"
              type="number"
              placeholder="0"
              {...register("vegan", {
                min: { value: 0, message: msg },
                max: { value: 10, message: msg },
              })}
            />
            <ErrorBar error={errors.vegan} />
          </label>
        </div>

        <div className="card-actions flex justify-center mb-8">
          <button
            className="btn btn-sm px-8 bg-[#3c4f5b] text-white hover:bg-[#bfb58b]"
            type="submit"
          >
            אישור
          </button>
        </div>

        <div className="text-sm text-center">
          במקרה של שינוי אנא עדכנו את איטה ספרנאי או גלי אמיר🙏
        </div>
      </form>
    </div>
  );
}
