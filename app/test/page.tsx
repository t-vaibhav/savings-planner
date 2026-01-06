"use client";

import { Modal } from "@/components/Modal";

export default function Example() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Modal Examples</h1>

            {/* Example 1: Simple Modal */}
            <Modal
                trigger={
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Open Modal
                    </button>
                }
            >
                <div className="space-y-4">
                    <p>This is the modal content. Super simple!</p>
                    <p>No need to manage state yourself.</p>
                </div>
            </Modal>
        </div>
    );
}
