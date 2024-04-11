import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

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
import { Files } from "lucide-react"

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
  const { toast } = useToast()
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
    let { content } = values
    const { translations } = values
    translations.forEach(({ oldWord, newWord }) => {
      const regex = new RegExp(`\\b${oldWord}\\b`, "gi")
      content = content.replace(regex, (matched) => {
        return matched === matched.toUpperCase()
          ? newWord.toUpperCase()
          : matched ===
            matched[0].toUpperCase() + matched.slice(1).toLowerCase()
          ? newWord[0].toUpperCase() + newWord.slice(1).toLowerCase()
          : newWord.toLowerCase()
      })
    })
    setTranslatedContent(content)
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(translatedContent).then(() => {
      toast({
        title: "Content copied",
        description: "The translated content has been copied to your clipboard",
      })
    })
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
          <div data-rehype-pretty-code-fragment>
            <pre className="bg-zinc-900 rounded-lg p-3 text-sm font-mono overflow-y-auto overflow-x-hidden whitespace-pre-wrap max-h-64 z-0">
              <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {translatedContent}
              </code>
            </pre>
            <Button
              onClick={handleCopyContent}
              className="absolute right-4 top-4 p-0 w-6 h-6 hover:bg-zinc-800 z-10"
            >
              <span className="sr-only">Copy</span>
              <Files
                size={15}
                className="h-4 w-4"
                color="#ffffff"
                strokeWidth={1}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TranslateForm
