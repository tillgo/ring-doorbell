import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'

export const Route = createFileRoute('/register-device')({
    component: RegisterDevice,
})
function RegisterDevice() {
    return (
        <div className="mx-auto w-full max-w-2xl">
            <section className="w-full">
                <Scanner
                    components={{ audio: false, tracker: true, torch: false }}
                    onResult={(text, result) => console.log(text, result)}
                />
            </section>
        </div>
    )
}
