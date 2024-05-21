import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'

export const Route = createFileRoute('/register-device')({
    component: RegisterDevice,
})
function RegisterDevice() {
    return (
        <section className="aspect-square w-[500px]">
            <Scanner
                components={{ audio: false, tracker: true }}
                onResult={(text, result) => console.log(text, result)}
            />
        </section>
    )
}
