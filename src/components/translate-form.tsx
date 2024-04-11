import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  content: z.string().min(1, "Content is required"),
  translations: z.array(
    z.object({
      oldWord: z.string().min(1, "Old word is required"),
      newWord: z.string().min(1, "New word is required"),
    })
  ),
})

const TranslateForm = () => {
  const [translatedContent, setTranslatedContent] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      translations: [{ oldWord: "", newWord: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "translations",
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    let { content, translations } = values
    translations.forEach(({ oldWord, newWord }) => {
      const regex = new RegExp(oldWord, "gi")
      content = content.replace(regex, newWord)
    })
    setTranslatedContent(content)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={7} />
                </FormControl>
                <FormDescription>
                  Enter the content you want to translate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-row max-md:flex-col gap-4 items-end"
            >
              <FormField
                control={form.control}
                name={`translations.${index}.oldWord`}
                render={({ field }) => (
                  <FormItem className="flex-1 max-md:w-full">
                    <FormLabel>
                      Old Word <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`translations.${index}.newWord`}
                render={({ field }) => (
                  <FormItem className="flex-1 max-md:w-full">
                    <FormLabel>
                      New Word <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => remove(index)}
                className="max-md:w-full"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ oldWord: "", newWord: "" })}
          >
            Add Word
          </Button>
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      {translatedContent && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Translated Content</h2>
          <p className="mt-2">{translatedContent}</p>
        </div>
      )}
    </div>
  )
}

export default TranslateForm
