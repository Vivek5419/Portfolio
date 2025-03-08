import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Vivek transformed my content. His editing style helped my shorts get over 1M views!",
      author: "Alex Chen",
      role: "Content Creator",
      avatar: "AC",
    },
    {
      quote: "The turnaround time is incredible. Professional quality edits delivered faster than anyone else.",
      author: "Priya Singh",
      role: "YouTube Influencer",
      avatar: "PS",
    },
    {
      quote: "Working with Vivek has been a game-changer for my channel. His editing skills are unmatched.",
      author: "Marcus Johnson",
      role: "Gaming Creator",
      avatar: "MJ",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Client <span className="text-gray-400">Feedback</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?text=${testimonial.avatar}`} />
                  <AvatarFallback className="bg-zinc-800">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

